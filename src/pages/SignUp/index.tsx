import React, { useCallback, useRef } from "react";
import { Alert, Image, TextInput } from "react-native";
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from "@react-navigation/native";
import { Form } from "@unform/mobile";
import { FormHandles } from "@unform/core";
import * as Yup from 'yup';
import api from "../../services/api";

import Input from "../../components/input";
import Button from "../../components/Button";
import { Container, Title, BackToSignIn, BackToSignInText} from './styles';
import getValidationErrors from "../../utils/getValidationErrors";

import logoImg from '../../assets/logo.png';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const  SignUp: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const navigation = useNavigation();

    const handleSignUp = useCallback( async (data: SignUpFormData) => {
      try {
          formRef.current?.setErrors({});
          const schema = Yup.object().shape({
              name: Yup.string().required('Nome obrigatório'),
              email: Yup.string().required('Email obrigatório').email('Digite seu email'),
              password: Yup.string().min(6, 'No mínimo 6 dígitos'),
          });

          await schema.validate(data, {
              abortEarly: false,
            });
    
            await api.post('/users', data);

            Alert.alert('Cadastro realizado com sucesso!');
    
            navigation.goBack();
    
          } catch (err) {
            if (err instanceof Yup.ValidationError) {
              const errors = getValidationErrors(err);
    
              formRef.current?.setErrors(errors);
    
              return;
            }
    
            Alert.alert( 'Erro no cadastro','Ocorreu um erro ao fazer cadastro, tente novamente.',);
          }
        }
        , [navigation]
    );

    return (
        <>
              <Container>
                <Image source={logoImg} />
                <Title>Crie sua conta</Title>
            
                <Form ref={formRef} onSubmit={handleSignUp}>
                    <Input autoCapitalize="words" name="name" icon="user" placeholder="Nome" returnKeyType="next" />
        
                    <Input keyboardType="email-address" autoCorrect={false} autoCapitalize="none" name="email" icon="mail" placeholder="E-mail" returnKeyType="next"/>
        
                    <Input secureTextEntry name="password" icon="lock" placeholder="Senha" returnKeyType="send" onSubmitEditing= {() => formRef.current?.submitForm()} />
        
                    <Button onPress={() => formRef.current?.submitForm()}>Entrar</Button>
                </Form>
            </Container>
            
    
          <BackToSignIn onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={20} color="#fff" />
    
            <BackToSignInText>Voltar para logIn</BackToSignInText>
          </BackToSignIn>
        </>
      );
}

export default SignUp;