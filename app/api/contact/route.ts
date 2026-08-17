/**
 * Contact form submission API endpoint
 * POST /api/contact
 */

import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail } from '@/lib/email';
import { withRateLimit, strictRateLimiter } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';
import { isValidEmail } from '@/lib/validation';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

/**
 * Validate contact form data
 */
function validateContactForm(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.name || typeof data.name !== 'string') {
    errors.push('Name is required');
  } else if (data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  } else if (data.name.trim().length > 100) {
    errors.push('Name must be less than 100 characters');
  }

  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email is required');
  } else if (!isValidEmail(data.email)) {
    errors.push('Invalid email address');
  }

  if (!data.message || typeof data.message !== 'string') {
    errors.push('Message is required');
  } else if (data.message.trim().length < 10) {
    errors.push('Message must be at least 10 characters');
  } else if (data.message.trim().length > 5000) {
    errors.push('Message must be less than 5000 characters');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * POST handler for contact form submissions
 */
export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting (3 requests per minute)
    const rateLimitResult = await withRateLimit(request, strictRateLimiter);

    if (!rateLimitResult.success) {
      logger.warn('Rate limit exceeded for contact form');
      return NextResponse.json(
        {
          success: false,
          error: 'Too many requests. Please try again later.',
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.reset.toString(),
            'Retry-After': Math.ceil((rateLimitResult.reset - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    // Parse request body
    let data: ContactFormData;
    try {
      data = await request.json();
    } catch (error) {
      logger.error('Invalid JSON in contact form request');
      return NextResponse.json(
        { success: false, error: 'Invalid request data' },
        { status: 400 }
      );
    }

    // Validate form data
    const validation = validateContactForm(data);
    if (!validation.valid) {
      logger.warn('Contact form validation failed:', validation.errors);
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          errors: validation.errors,
        },
        { status: 400 }
      );
    }

    // Sanitize data
    const sanitizedData: ContactFormData = {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      message: data.message.trim(),
    };

    // Send email
    const emailResult = await sendContactEmail(sanitizedData);

    if (!emailResult.success) {
      logger.error('Failed to send contact email:', emailResult.error);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to send message. Please try again later.',
        },
        { status: 500 }
      );
    }

    logger.info('Contact form submitted successfully:', {
      name: sanitizedData.name,
      email: sanitizedData.email,
      messageId: emailResult.messageId,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Message sent successfully',
      },
      {
        status: 200,
        headers: {
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.reset.toString(),
        },
      }
    );
  } catch (error) {
    logger.error('Unexpected error in contact form handler:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred. Please try again later.',
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS handler for CORS preflight
 */
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  );
}
