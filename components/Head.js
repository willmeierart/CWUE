// literally HTML head - all SEO stuff, etc.
import Head from 'next/head'

const initialProps = {
  title: 'Carwash USA Express',
  initialScale: '1.0'
}

const CustomHead = (props = initialProps) => {
  const { title, initialScale, children } = props
  return <Head>
    <title key='title'>{title}</title>
    <meta key='charSet' charSet='utf-8' />
    <meta key='viewport' name='viewport' content={`inital-scale=${initialScale || initialProps.initialScale}, width=device-width, shrink-to-fit=no`} />
    <meta key='meta-title' name='title' content='Carwash USA Express' />
    <link rel='shortcut icon' href='/static/favicon.ico' />
    <script defer src='https://use.fontawesome.com/releases/v5.0.6/js/all.js' />
    { children }
    {/* <script key='google-map' type='text/javascript' src={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_KEY}&libraries=places`} async defer /> */}
    {/* <script async src='https://www.googletagmanager.com/gtag/js?id=UA-XXXXXXXX-X' /> */}
  </Head>
}

export default CustomHead
