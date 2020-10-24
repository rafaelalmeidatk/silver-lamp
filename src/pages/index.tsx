import Head from 'next/head';
import Calculator from '../components/Calculator';

export default function Home() {
  return (
    <>
      <Head>
        <title>Simule sua Antecipação</title>
      </Head>
      <Calculator />
    </>
  );
}
