"use client";

import { Box, Button, Container, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { VscWorkspaceTrusted } from "react-icons/vsc";

type VerifyNumber = {
  "0": string;
  "1": string;
  "2": string;
  "3": string;
};

const Verification = () => {
  const [invalidError, setInvalidError] = useState(false);
  const router = useRouter();

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const [verifyNumber, setVerifyNumber] = useState<VerifyNumber>({
    0: "",
    1: "",
    2: "",
    3: "",
  });

  const verificationHandler = async () => {
    const otp = Object.values(verifyNumber).join("");
    if (otp.length < 4) {
      setInvalidError(true);
      return;
    }

  };

  const handleInputChange = (index: number, value: string) => {
    setInvalidError(false);
    const newVerifyNumber = { ...verifyNumber, [index]: value };

    setVerifyNumber(newVerifyNumber);

    if (value === "" && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (value.length === 1 && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        border: "1px solid",
        borderColor: "secondary.main",
        borderRadius: 2,
        padding: 4,
        boxShadow: 3,
        backgroundColor: "#00004a",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 0,
          padding: 3,
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom>
          Verify Your Account
        </Typography>
        <VscWorkspaceTrusted size={40} />
        <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
          {Object.keys(verifyNumber).map((key, index) => (
            <TextField
              key={key}
              inputRef={inputRefs[index]}
              inputProps={{
                maxLength: 1,
                style: {
                  textAlign: "center",
                  fontSize: "18px",
                  width: "45px",
                  height: "45px",
                },
              }}
              className="shake bg-white"
              value={verifyNumber[key as keyof VerifyNumber]}
              onChange={(e) => handleInputChange(index, e.target.value)}
              error={invalidError}
            />
          ))}
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={verificationHandler}
          sx={{ mt: 3 }}
        >
          Verify OTP
        </Button>
        <Box sx={{ mt: 3, textAlign: "center" }}>
          {"Didn't receive a code? "}
          <Link href="/signup" className="text-[crimson]">
            Sign up Here
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default Verification;
