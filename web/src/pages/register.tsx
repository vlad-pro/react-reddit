import React from "react";
import { Form, Formik } from "formik";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useMutation } from "urql";

interface registerProps {}

const REGISTER_MUTATION = `
mutation Register($username: String!, $password: String!) {
  register(options: { username: $username, password: $password }) {
    user {
      createdAt
      id
      updatedAt
      username
    }
  }
}
`;

const Register: React.FC<registerProps> = ({}) => {
  const [, register] = useMutation(REGISTER_MUTATION);
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={(values) => {
          return register(values); // returning a Promise finishes submitting
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              placeholder="username"
              label="Useraname"
            />
            <Box mt={4}>
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
            </Box>
            <Button
              mt={4}
              isLoading={isSubmitting}
              type="submit"
              colorScheme="teal"
            >
              register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
