"use client";

import { useActivationMutation } from "@/redux/features/auth/authApi";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

type VerifyNumber = {
  "0": string;
  "1": string;
  "2": string;
  "3": string;
};

const Verification = () => {
  const [invalidError, setInvalidError] = useState(false);
  const router = useRouter();

  const { token } = useSelector((state: any) => state.auth);
  const [activation, { isSuccess, isError, error }] = useActivationMutation();
  
  console.log(token)

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

  useEffect(() => {
    if (isSuccess) {
      toast.success("Account Activated");
      router.push("/");
    }

    if (isError && error) {
      if ("data" in error) {
        const errorData = error as any as { data: { message: string } } || 'Error in Activation';
        toast.error(errorData?.data.message);
        setInvalidError(true);
      } else {
        console.log("Error in Activation");
        toast.error("An unknown error occurred");
      }
    }
  }, [isSuccess, isError, error, router]);

  const verificationHandler = async () => {
    const otp = Object.values(verifyNumber).join("");
    if (otp.length < 4) {
      setInvalidError(true);
      return;
    }

    const activationData = {
      activation_token: token,
      activation_code: otp
    }

    try {
      const response = await activation(activationData);
    } catch (error) {
      console.log('Activation error:', error);
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
