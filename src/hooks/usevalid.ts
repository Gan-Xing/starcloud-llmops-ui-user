import * as Yup from 'yup';

interface Variable {
    key: string;
    field: string;
    label: string;
    type: string;
    // 其他字段...
}

const generateValidationSchema = (variables: Variable[]) => {
    const validationSchemaFields: Record<string, Yup.AnySchema> = {};

    variables &&
        variables.forEach((variable: any) => {
            const { field, label } = variable;
            validationSchemaFields[field] = Yup.string().required(`${label}不能为空`);
        });

    return Yup.object().shape(validationSchemaFields);
};
export default generateValidationSchema;
