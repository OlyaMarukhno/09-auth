import { NextRequest, NextResponse } from 'next/server';
import { api } from '../../api';
import { cookies } from 'next/headers';
import { parseSetCookie } from 'cookie';
import { isAxiosError } from 'axios';
import { logErrorResponse } from '../../_utils/utils';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const apiRes = await api.post('auth/login', body);

    const cookieStore = await cookies();
    const setCookie = apiRes.headers['set-cookie'];

    if (setCookie) {
      const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
      for (const cookieStr of cookieArray) {
        const parsed = parseSetCookie(cookieStr);
        
        if (parsed.value) {
          // Сохраняем оригинальную куку от бэкенда
          cookieStore.set(parsed.name, parsed.value, {
            httpOnly: parsed.httpOnly,
            secure: false,
            path: parsed.path || '/',
            maxAge: parsed.maxAge,
          });

          // Дублируем под именем 'token', чтобы serverApi и прокси успешно проходили проверку
          if (parsed.name === 'refreshToken' || parsed.name.includes('token')) {
            cookieStore.set('token', parsed.value, {
              httpOnly: parsed.httpOnly,
              secure: false,
              path: '/',
              maxAge: parsed.maxAge,
            });
          }
        }
      } 

      return NextResponse.json(apiRes.data, { status: apiRes.status });
    }

    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.status }
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}