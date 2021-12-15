import React from "react";
import Text from "./Text";

const KeyValueText = ({ k, value }: { k: string; value?: string }) => (
  <Text>
    <strong>{k}:</strong> {value}
  </Text>
);

export default KeyValueText;
