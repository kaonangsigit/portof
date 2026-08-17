/**
 * Health check API endpoint
 * GET /api/health
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  checks: {
    name: string;
    status: 'pass' | 'fail';
    message?: string;
    responseTime?: number;
  }[];
}

/**
 * Check environment variables
 */
async function checkEnvironment(): Promise<{ status: 'pass' | 'fail'; message?: string; responseTime: number }> {
  const startTime = Date.now();
  
  try {
    const requiredEnvVars = ['GITHUB_TOKEN', 'GITHUB_USERNAME'];
    const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

    if (missingVars.length > 0) {
      return {
        status: 'fail',
        message: `Missing environment variables: ${missingVars.join(', ')}`,
        responseTime: Date.now() - startTime,
      };
    }

    return {
      status: 'pass',
      responseTime: Date.now() - startTime,
    };
  } catch (error) {
    return {
      status: 'fail',
      message: 'Failed to check environment',
      responseTime: Date.now() - startTime,
    };
  }
}

/**
 * Check GitHub API connectivity
 */
async function checkGitHubAPI(): Promise<{ status: 'pass' | 'fail'; message?: string; responseTime: number }> {
  const startTime = Date.now();
  
  try {
    const response = await fetch('https://api.github.com/zen', {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      return {
        status: 'fail',
        message: `GitHub API returned status ${response.status}`,
        responseTime: Date.now() - startTime,
      };
    }

    return {
      status: 'pass',
      responseTime: Date.now() - startTime,
    };
  } catch (error) {
    return {
      status: 'fail',
      message: error instanceof Error ? error.message : 'Unknown error',
      responseTime: Date.now() - startTime,
    };
  }
}

/**
 * Check memory usage
 */
async function checkMemory(): Promise<{ status: 'pass' | 'fail'; message?: string; responseTime: number }> {
  const startTime = Date.now();
  
  try {
    const memoryUsage = process.memoryUsage();
    const heapUsedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
    const heapTotalMB = Math.round(memoryUsage.heapTotal / 1024 / 1024);
    const heapPercentage = Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100);

    // Consider unhealthy if using more than 90% of heap
    if (heapPercentage > 90) {
      return {
        status: 'fail',
        message: `High memory usage: ${heapUsedMB}MB / ${heapTotalMB}MB (${heapPercentage}%)`,
        responseTime: Date.now() - startTime,
      };
    }

    return {
      status: 'pass',
      message: `Memory usage: ${heapUsedMB}MB / ${heapTotalMB}MB (${heapPercentage}%)`,
      responseTime: Date.now() - startTime,
    };
  } catch (error) {
    return {
      status: 'fail',
      message: 'Failed to check memory',
      responseTime: Date.now() - startTime,
    };
  }
}

/**
 * GET handler for health check
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Run all health checks in parallel
    const [envCheck, githubCheck, memoryCheck] = await Promise.all([
      checkEnvironment(),
      checkGitHubAPI(),
      checkMemory(),
    ]);

    const checks = [
      { name: 'environment', ...envCheck },
      { name: 'github_api', ...githubCheck },
      { name: 'memory', ...memoryCheck },
    ];

    // Determine overall status
    const failedChecks = checks.filter((check) => check.status === 'fail');
    let status: 'healthy' | 'degraded' | 'unhealthy';

    if (failedChecks.length === 0) {
      status = 'healthy';
    } else if (failedChecks.length === checks.length) {
      status = 'unhealthy';
    } else {
      status = 'degraded';
    }

    const healthStatus: HealthStatus = {
      status,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks,
    };

    // Log if not healthy
    if (status !== 'healthy') {
      logger.warn('Health check failed:', {
        status,
        failedChecks: failedChecks.map((c) => c.name),
      });
    }

    // Return appropriate status code
    const statusCode = status === 'healthy' ? 200 : status === 'degraded' ? 200 : 503;

    return NextResponse.json(healthStatus, {
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    logger.error('Health check error:', error);

    const healthStatus: HealthStatus = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks: [
        {
          name: 'health_check',
          status: 'fail',
          message: error instanceof Error ? error.message : 'Unknown error',
          responseTime: Date.now() - startTime,
        },
      ],
    };

    return NextResponse.json(healthStatus, {
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json',
      },
    });
  }
}
