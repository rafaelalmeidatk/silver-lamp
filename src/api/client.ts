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
