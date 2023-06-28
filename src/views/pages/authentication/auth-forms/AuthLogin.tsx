import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Typography
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import { AiOutlineWechat } from 'react-icons/ai';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

//Ruoyi API
import * as LoginApi from 'api/login';
import * as authUtil from 'utils/auth';
import { t } from 'hooks/web/useI18n';
import LoginModal from './AuthLoginModal';
// import { TrendingUp } from '@mui/icons-material';

// ===============================|| JWT LOGIN ||=============================== //

const JWTLogin = ({ loginProp, ...others }: { loginProp?: number }) => {
    const theme = useTheme();
    const { login } = useAuth();
    const [open, setOpen] = useState(false);
    const [ticket, setTicket] = useState('');
    const scriptedRef = useScriptRef();
    const [loginData, setLoginData] = useState({
        isShowPassword: false,
        captchaEnable: process.env.REACT_APP_CAPTCHA_ENABLE,
        // tenantEnable: process.env.REACT_APP_TENANT_ENABLE,
        loginForm: {
            // tenantName: '',
            username: 'admin',
            password: 'admin123',
            captchaVerification: '',
            rememberMe: false
        }
    });
    const [showPassword, setShowPassword] = React.useState(false);
    const [qrUrl, setQrurl] = React.useState(null);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event: React.MouseEvent) => {
        event.preventDefault()!;
    };

    // const getTenantId = async () => {
    //     if (loginData.tenantEnable === 'true') {
    //         const res = await LoginApi.getTenantIdByName(loginData.loginForm.tenantName);
    //         authUtil.setTenantId(res);
    //         console.log('getTenantId', authUtil.getTenantId());
    //     }
    // };
    const handleWeChat = async () => {
        const res = await LoginApi.getQRcode();
        if (res) {
            setQrurl(res?.url);
            setOpen(true);
            setTicket(res?.ticket);
        }
    };
    useEffect(() => {
        let intervalId: ReturnType<typeof setInterval>;

        const polling = async () => {
            const res = await LoginApi.qRcodeLogin({ ticket });
            if (!res?.data) {
                return;
            }
            authUtil.setToken(res?.data);
            await login();

            // 清除定时器
            clearInterval(intervalId as unknown as number);
        };

        if (ticket) {
            // 设置定时器
            intervalId = setInterval(polling, 2000); // 例如，每5秒轮询一次
        }

        return () => {
            // 在组件卸载或者重新渲染时清除定时器
            clearInterval(intervalId as unknown as number);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ticket]);

    return (
        <Formik
            initialValues={{
                email: '',
                password: '',
                captchaVerification: '', // Add this line
                submit: null
            }}
            validationSchema={Yup.object().shape({
                // email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                password: Yup.string().max(255).required('Password is required'),
                captchaVerification: Yup.string() // And this line (optional, if you want validation for captchaVerification)
            })}
            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                try {
                    // await getTenantId();
                    const updatedLoginForm = {
                        ...loginData.loginForm,
                        username: values.email,
                        password: values.password,
                        captchaVerification: values?.captchaVerification
                    };
                    const res = await LoginApi.login(updatedLoginForm);
                    if (!res) {
                        return;
                    }
                    setLoginData((prevState) => ({
                        ...prevState,
                        loginForm: updatedLoginForm
                    }));
                    if (loginData.loginForm.rememberMe) {
                        authUtil.setLoginForm(updatedLoginForm);
                    } else {
                        authUtil.removeLoginForm();
                    }
                    authUtil.setToken(res);
                    await login();
                    if (scriptedRef.current) {
                        setStatus({ success: true });
                        setSubmitting(false);
                    }
                } catch (err: any) {
                    console.error(err);
                    if (scriptedRef.current) {
                        setStatus({ success: false });
                        setErrors({ submit: err.message });
                        setSubmitting(false);
                    }
                }
            }}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                <form noValidate onSubmit={handleSubmit} {...others}>
                    <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                        <InputLabel htmlFor="outlined-adornment-email-login">Email Address / Username</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-email-login"
                            type="email"
                            value={values.email}
                            name="email"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            inputProps={{}}
                        />
                        {touched.email && errors.email && (
                            <FormHelperText error id="standard-weight-helper-text-email-login">
                                {errors.email}
                            </FormHelperText>
                        )}
                    </FormControl>

                    <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
                        <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password-login"
                            type={showPassword ? 'text' : 'password'}
                            value={values.password}
                            name="password"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                        size="large"
                                    >
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            inputProps={{}}
                            label="Password"
                        />
                        {touched.password && errors.password && (
                            <FormHelperText error id="standard-weight-helper-text-password-login">
                                {errors.password}
                            </FormHelperText>
                        )}
                    </FormControl>

                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={loginData.loginForm.rememberMe}
                                        onChange={(event) =>
                                            setLoginData({
                                                ...loginData,
                                                loginForm: {
                                                    ...loginData.loginForm,
                                                    rememberMe: event.target.checked
                                                }
                                            })
                                        }
                                        name="rememberMe"
                                        color="primary"
                                    />
                                }
                                label={t('sys.login.rememberMe')}
                            />
                        </Grid>
                        <Grid item>
                            <Typography
                                variant="subtitle1"
                                component={Link}
                                to={loginProp ? `/pages/forgot-password/forgot-password${loginProp}` : '/forgot'}
                                color="secondary"
                                sx={{ textDecoration: 'none' }}
                            >
                                Forgot Password?
                            </Typography>
                        </Grid>
                    </Grid>

                    {errors.submit && (
                        <Box sx={{ mt: 3 }}>
                            <FormHelperText error>{errors.submit}</FormHelperText>
                        </Box>
                    )}
                    <Box sx={{ mt: 2 }}>
                        <AnimateButton>
                            <Button color="secondary" disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained">
                                Sign In
                            </Button>
                        </AnimateButton>
                    </Box>
                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                        <Divider sx={{ flexGrow: 1 }} />
                        <Box px={2}>其他登录方式</Box>
                        <Divider sx={{ flexGrow: 1 }} />
                    </Box>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                        <AiOutlineWechat size={30} onClick={handleWeChat} style={{ cursor: 'pointer' }} />
                    </Box>

                    <LoginModal open={open} qrUrl={qrUrl} handleClose={() => setOpen(false)} />
                </form>
            )}
        </Formik>
    );
};

export default JWTLogin;
