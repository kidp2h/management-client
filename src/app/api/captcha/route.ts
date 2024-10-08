import axios from 'axios';

import { env } from '@/../env.mjs';

export async function POST(req: Request) {
  if (!req.method.includes('POST')) {
    return new Response(
      JSON.stringify({ message: 'Only POST requests allowed' }),
      { status: 405 },
    );
  }

  const data = await req.json();
  const { token } = data;
  const secretKey: string | undefined = env.RECAPTCHA_SECRET_KEY;

  if (!token) {
    console.log('Token not found');
    return new Response(JSON.stringify({ message: 'Token not found' }), {
      status: 405,
    });
  }

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`,
    );

    if (response.data.success) {
      return new Response(JSON.stringify({ message: 'Success' }), {
        status: 200,
      });
    } else {
      console.log('Failed to verify', response);
      return new Response(JSON.stringify({ message: 'Failed to verify' }), {
        status: 405,
      });
    }
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
    });
  }
}
