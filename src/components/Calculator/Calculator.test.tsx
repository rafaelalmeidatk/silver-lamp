import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import Calculator from './index';
import { config } from '../../config';

describe('Calculator', () => {
  const server = setupServer();

  beforeAll(() => server.listen());
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());

  const fillTheForm = () => {
    const amountInput = screen.getByRole('textbox', {
      name: /informe o valor da venda \*/i,
    });
    const installmentsInput = screen.getByRole('textbox', {
      name: /em quantas parcelas \*/i,
    });
    const mdrInput = screen.getByRole('textbox', {
      name: /informe o percentual de mdr \*/i,
    });

    userEvent.type(amountInput, '15000');
    userEvent.type(installmentsInput, '6');
    userEvent.type(mdrInput, '5');
  };

  it('shows the correct values when filling the form', async () => {
    server.use(
      rest.post('**/', (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({ '1': 2694, '15': 2735, '30': 2779, '90': 2888 })
        );
      })
    );

    render(<Calculator />);

    fillTheForm();

    await waitFor(() => {
      expect(screen.getByTestId('day-1').textContent).toBe('R$ 2694');
      expect(screen.getByTestId('day-15').textContent).toBe('R$ 2735');
      expect(screen.getByTestId('day-30').textContent).toBe('R$ 2779');
      expect(screen.getByTestId('day-90').textContent).toBe('R$ 2888');
    });
  });

  it('shows the alert with the unknown error message', async () => {
    server.use(
      rest.post('**/', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({}));
      })
    );

    render(<Calculator />);

    fillTheForm();

    await waitFor(() => {
      expect(
        screen.getByText(config.errorMessages.unknown.message)
      ).toBeInTheDocument();
    });
  });

  it('shows the alert with the timeout error message', async () => {
    server.use(
      rest.post('**/', (req, res, ctx) => {
        return res(ctx.status(408), ctx.json({}));
      })
    );

    render(<Calculator />);

    fillTheForm();

    await waitFor(() => {
      expect(
        screen.getByText(config.errorMessages.timeout.message)
      ).toBeInTheDocument();
    });
  });

  it('shows the alert with the delay message', async () => {
    server.use(
      rest.post('**/', (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.delay(1600),
          ctx.json({ '1': 2694, '15': 2735, '30': 2779, '90': 2888 })
        );
      })
    );

    render(<Calculator />);

    const amountInput = screen.getByRole('textbox', {
      name: /informe o valor da venda \*/i,
    });
    const installmentsInput = screen.getByRole('textbox', {
      name: /em quantas parcelas \*/i,
    });
    const mdrInput = screen.getByRole('textbox', {
      name: /informe o percentual de mdr \*/i,
    });

    userEvent.type(amountInput, '15000');
    userEvent.type(installmentsInput, '6');
    userEvent.type(mdrInput, '5');

    await waitFor(
      () => {
        expect(
          screen.getByText(config.errorMessages.delay.message)
        ).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    await waitFor(() => {
      expect(screen.getByTestId('day-1').textContent).toBe('R$ 2694');
    });
  });
});
