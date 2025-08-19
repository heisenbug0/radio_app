import { createGetInitialProps } from "@mantine/next";
import Document, { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";

const getInitialProps = createGetInitialProps();

export default class _Document extends Document {
  static getInitialProps = getInitialProps;

  render() {
    return (
      <Html>
        <Head>
          <Script
            id="googleMaps"
            strategy="beforeInteractive"
            src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&loading=async&libraries=places&callback=initMap`}
          />
          <link
            rel="stylesheet"
            href="https://unpkg.com/cloudinary-video-player@1.11.1/dist/cld-video-player.min.css"
          />
          <script
            src="https://upload-widget.cloudinary.com/latest/global/all.js"
            type="text/javascript"
            async
          ></script>
          <link rel="canonical" href="www.iloverealestate.com" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
