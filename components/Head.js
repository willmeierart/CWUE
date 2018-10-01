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
    <style dangerouslySetInnerHTML={{__html: `
      @font-face {
        font-family: 'Gotham';
        src: url('GothamMedium.eot');
        src: url('GothamMedium.eot?#iefix') format('embedded-opentype'),
            url('GothamMedium.woff') format('woff');
        font-weight: 500;
        font-style: normal;
      }
      @font-face {
        font-family: 'Gotham Book';
        src: url('GothamBook-Italic.eot');
        src: url('GothamBook-Italic.eot?#iefix') format('embedded-opentype'),
            url('GothamBook-Italic.woff') format('woff');
        font-weight: normal;
        font-style: italic;
      }
      @font-face {
        font-family: 'Gotham';
        src: url('GothamBlack.eot');
        src: url('GothamBlack.eot?#iefix') format('embedded-opentype'),
            url('GothamBlack.woff') format('woff');
        font-weight: 900;
        font-style: normal;
      }
      @font-face {
        font-family: 'Gotham Book';
        src: url('GothamBook.eot');
        src: url('GothamBook.eot?#iefix') format('embedded-opentype'),
            url('GothamBook.woff') format('woff');
        font-weight: normal;
        font-style: normal;
      }
      @font-face {
        font-family: 'Montserrat';
        src: url('/wp-content/themes/CGO/dist/fonts/Montserrat-Bold.eot');
        src: url('/wp-content/themes/CGO/dist/fonts/Montserrat-Bold.eot?#iefix') format('embedded-opentype'), url('/wp-content/themes/CGO/dist/fonts/Montserrat-Bold.woff') format('woff');
        font-weight: bold;
        font-style: normal;
      }
    `}} />
  </Head>
}

export default CustomHead
