import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const AppDownloadCTA = () => {
  return (
    <div className="bg-light py-5 border-top border-bottom">
      <Container className="text-center">
        <h2 className="fw-bold mb-3">Download the BBSCART App Now</h2>
        <p className="text-muted mb-4">
          Book care, track plans, get instant support — all from your phone.
        </p>

    <div className="flex flex-wrap justify-center items-center gap-4 py-6">
  <a
    href="https://play.google.com/store/apps/details?id=com.bbscart.app"
    target="_blank"
    rel="noopener noreferrer"
  >
    <img
      src="/img/hero/playstore.png"
      alt="Get it on Google Play"
      className="h-[100px] w-[220px] object-contain"
    />
  </a>

  <a
    href="https://apps.apple.com/app/id0000000000"
    target="_blank"
    rel="noopener noreferrer"
  >
    <img
      src="/img/hero/app.svg"
      alt="Download on the App Store"
      className="h-[60px] w-[180px] object-contain"
    />
  </a>
</div>


      </Container>
    </div>
  );
};

export default AppDownloadCTA;
