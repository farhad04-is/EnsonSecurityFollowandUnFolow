// src/LoginForm.jsx
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Kullanıcı adı zorunlu'),
  password: Yup.string().required('Şifre zorunlu'),
});

const LoginForm = ({ onSwitchToSignUp }) => {
  const API_BASE_URL = 'http://localhost:8082/auth';
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, values, {
        headers: {
          'Content-Type': 'application/json'
        },
        responseType: 'text'
      });

      const token = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('username',values.username)
  
        navigate('/videoinput');


    } catch (error) {
      const errorText = error.response?.data || 'Bir hata oluştu. Lütfen tekrar deneyin.';
      setMessage(`Giriş başarısız: ${errorText}`);
      setMessageType('error');
    } finally {
      setSubmitting(false);
    }
  };

  const styles = {
    container: {
      maxWidth: '400px',
      margin: '50px auto',
      padding: '20px',
      backgroundColor: '#f4f4f4',
      borderRadius: '10px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
    },
    input: {
      width: '100%',
      padding: '10px',
      marginTop: '5px',
      border: '1px solid #ccc',
      borderRadius: '5px'
    },
    button: {
      padding: '10px',
      marginTop: '20px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer'
    },
    error: {
      color: 'red',
      fontSize: '12px',
      marginTop: '5px'
    },
    message: {
      marginTop: '15px',
      fontWeight: 'bold'
    }
  };

  return (
    <div style={styles.container}>
      <h2>Giriş Yap</h2>
      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label>Kullanıcı Adı</label>
              <Field name="username" style={styles.input} />
              <ErrorMessage name="username" component="div" style={styles.error} />
            </div>
            <div>
              <label>Şifre</label>
              <Field name="password" type="password" style={styles.input} />
              <ErrorMessage name="password" component="div" style={styles.error} />
            </div>
            <button type="submit" disabled={isSubmitting} style={styles.button}>
              Giriş Yap
            </button>
          </Form>
        )}
      </Formik>

      {message && (
        <div
          style={{
            ...styles.message,
            color: messageType === 'error' ? 'red' : 'green'
          }}
        >
          {message}
        </div>
      )}

      <p>
        Hesabınız yok mu?{' '}
        <button onClick={onSwitchToSignUp} style={{ background: 'none', color: 'blue', border: 'none', cursor: 'pointer' }}>
          Kayıt Ol
        </button>
      </p>
    </div>
  );
};

export default LoginForm;
