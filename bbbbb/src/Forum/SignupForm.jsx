// src/SignupForm.jsx
import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

export const SignupForm = () => {
  const API_BASE_URL = 'http://localhost:8082/auth';
  const navigate = useNavigate();

  const initialValues = {
    username: '',
    gmail: '',
    password: ''
  };

  const validationSchema = Yup.object({
    username: Yup.string()
      .required('İstifadəçi adı mütləqdir'),
    gmail: Yup.string()
      .email('Düzgün e-poçt daxil edin')
      .required('Gmail sahəsi boş ola bilməz'),
    password: Yup.string()
      .min(6, 'Şifrə ən azı 6 simvol olmalıdır')
      .required('Şifrə mütləqdir')
  });

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      await axios.post(`${API_BASE_URL}/register`, values);
      setStatus({ success: 'Qeydiyyat uğurludur!' });
    
      setTimeout(() => navigate('/login'), 1000);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        'Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.';
      setStatus({ error: errorMsg });
    }
    setSubmitting(false);
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
    field: {
      padding: '10px',
      margin: '5px 0 15px 0',
      border: '1px solid #ccc',
      borderRadius: '5px',
      width: '100%'
    },
    error: {
      color: 'red',
      fontSize: '0.9em',
      marginBottom: '10px'
    },
    button: {
      padding: '10px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer'
    },
    message: {
      marginTop: '15px',
      fontWeight: 'bold'
    }
  };

  return (
    <div style={styles.container}>
      <h2>Qeydiyyat</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, status }) => (
          <Form>
            <label>İstifadəçi adı:</label>
            <Field type="text" name="username" style={styles.field} />
            <ErrorMessage name="username" component="div" style={styles.error} />

            <label>Gmail ünvanı:</label>
            <Field
              type="email"
              name="gmail"
              placeholder="nümunə@istənilən.com"
              style={styles.field}
            />
            <ErrorMessage name="gmail" component="div" style={styles.error} />

            <label>Şifrə:</label>
            <Field type="password" name="password" style={styles.field} />
            <ErrorMessage name="password" component="div" style={styles.error} />

            <button type="submit" style={styles.button} disabled={isSubmitting}>
              Qeydiyyatdan keç
            </button>

            {status?.success && (
              <div style={{ ...styles.message, color: 'green' }}>{status.success}</div>
            )}
            {status?.error && (
              <div style={{ ...styles.message, color: 'red' }}>{status.error}</div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};
