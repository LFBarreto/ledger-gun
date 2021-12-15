import React, { useMemo } from "react";
import qrcode from "qrcode-generator";
import Text from "./Text";

function createQRCodeASCII(data) {
  var typeNumber = 4;
  var errorCorrectionLevel = "L";
  var qr = qrcode(typeNumber, errorCorrectionLevel);
  qr.addData(data);
  qr.make();
  return qr.createASCII(1);
}

const QRCode = ({ data = "" }) => {
  const qr = useMemo(() => {
    const rawQr = createQRCodeASCII(data);
    return rawQr;
  }, [data]);
  return (
    <Text
      style={{
        transform: "scale(83%, 100%)",
        lineHeight: "100%",
        whiteSpace: "pre",
        wordBreak: "keep-all",
      }}
    >
      {qr}
    </Text>
  );
};

export default QRCode;
