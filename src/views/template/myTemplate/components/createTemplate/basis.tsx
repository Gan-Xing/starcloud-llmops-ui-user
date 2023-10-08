import { useImperativeHandle, forwardRef } from 'react';
import {
    Card,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Autocomplete,
    Chip,
    OutlinedInput,
    Box,
    Stack,
    FormHelperText
} from '@mui/material';
import { t } from 'hooks/web/useI18n';
import { Anyevent } from 'types/template';
import { useFormik } from 'formik';
import marketStore from 'store/market';
import * as yup from 'yup';
const validationSchema = yup.object({
    name: yup.string().required(t('myApp.isrequire')),
    category: yup.string().required(t('myApp.isrequire'))
});

const Basis = forwardRef(({ initialValues, setValues }: Anyevent, ref) => {
    const categoryList = marketStore((state) => state.categoryList);
    useImperativeHandle(ref, () => ({
        submit: () => {
            formik.handleSubmit();
            return Object.values(formik.errors).length > 0;
        }
    }));
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: () => {}
    });

    return (
        <Card sx={{ overflow: 'visible' }}>
            <form>
                <TextField
                    color="secondary"
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                    value={formik?.values.name}
                    onChange={(e) => {
                        formik.handleChange(e);
                        setValues({ name: e.target.name, value: e.target.value });
                    }}
                    error={formik?.touched.name && Boolean(formik?.errors.name)}
                    helperText={formik?.touched.name && formik?.errors.name ? formik?.errors.name : ' '}
                    label={t('myApp.appName')}
                    name="name"
                    variant="outlined"
                />
                <TextField
                    sx={{ mt: 2 }}
                    color="secondary"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    multiline
                    minRows={6}
                    label={t('myApp.appDesc')}
                    name="description"
                    value={formik.values.description}
                    onChange={(e) => {
                        formik.handleChange(e);
                        setValues({ name: e.target.name, value: e.target.value });
                    }}
                    variant="outlined"
                />
                <FormControl fullWidth sx={{ mt: 4 }} error={formik?.touched.category && Boolean(formik?.errors.category)}>
                    <InputLabel color="secondary" id="category">
                        {t('myApp.categary')}
                    </InputLabel>
                    <Select
                        labelId="category"
                        name="category"
                        color="secondary"
                        value={formik.values.category}
                        onChange={(e) => {
                            formik.handleChange(e);
                            setValues({ name: e.target.name, value: e.target.value });
                        }}
                        label={t('myApp.categary')}
                    >
                        {categoryList.map(
                            (item) =>
                                item.code !== 'ALL' && (
                                    <MenuItem key={item.code} value={item.code}>
                                        {item.name}
                                    </MenuItem>
                                )
                        )}
                    </Select>
                    <FormHelperText>{formik?.touched.category && formik?.errors.category ? formik?.errors.category : ' '}</FormHelperText>
                </FormControl>
                <Stack sx={{ mt: 2 }}>
                    <Autocomplete
                        multiple
                        id="tags-filled"
                        options={[]}
                        defaultValue={formik.values.tags}
                        freeSolo
                        renderTags={(value: readonly string[], getTagProps) =>
                            value.map((option: string, index: number) => (
                                <Chip key={index} label={option} onDelete={getTagProps({ index }).onDelete} />
                            ))
                        }
                        onChange={(e: any, newValue) => {
                            setValues({ name: 'tags', value: newValue });
                        }}
                        renderInput={(params: any) => <TextField name="tags" color="secondary" {...params} label={t('myApp.scense')} />}
                    />
                </Stack>
            </form>
        </Card>
    );
});
export default Basis;
