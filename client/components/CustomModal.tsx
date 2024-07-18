import { Box, Container, Modal, Typography } from "@mui/material";

type CustomModalProps = {
  title: string;
};

const CustomModal = ({
  title
}: CustomModalProps) => {
  return (
    <Container>
      <Box className="box">
        <Typography>
          {title}
        </Typography>
      </Box>
    </Container>
  );
};

export default CustomModal;
