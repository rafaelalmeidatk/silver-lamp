// Creating our own error class for fetch errors. We want the promise to reject when
// the request isn't 2xx, so we need a custom error to store the response
class FetchError extends Error {
  public response: Response;

  constructor(response: Response) {
    const message = `Request failed with error ${response.status}`;

    super(message);

    this.name = 'FetchError';
    this.message = message;
    this.response = response;
  }
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const getAbortController = () => {
  return new AbortController();
};

type PostOptions = {
  signal?: AbortSignal;
};

const post = async <T>(
  url: string,
  data: Record<string, unknown>,
  options: PostOptions = {}
) => {
  const response = await fetch(baseUrl + url, {
    signal: options.signal,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    return response.json() as Promise<T>;
  } else {
    throw new FetchError(response);
  }
};

// We only have one request so this is fine here, but for more requests we may want to split
// this into other files
type CalculateArgs = {
  amount: number;
  installments: number;
  mdr: number;
  days: number[];
};

type CalculateResponse = {
  [key: string]: number;
};

export const calculate = (
  { amount, installments, mdr, days }: CalculateArgs,
  options: PostOptions
) => {
  return post<CalculateResponse>(
    '/',
    {
      amount,
      installments,
      mdr,
      days,
    },
    options
  );
};
