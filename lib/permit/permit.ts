import { Permit } from "permitio";

export const permit = new Permit({
  pdp: process.env.PERMIT_PDP_URL || "http://localhost:7766",
  token: process.env.PERMIT_SDK_TOKEN || "",
});
