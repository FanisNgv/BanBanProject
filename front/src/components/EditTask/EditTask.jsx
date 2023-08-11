import React from 'react';
import { Formik, Form, Field } from 'formik';

function EditTask(props) {
    return (
        <Formik
            initialValues={{ title: props.task.title, description: props.task.description }}
            validate={(values) => {
                const errors = {};
                if (!values.title) {
                    errors.title = 'Required';
                }
                return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
                props.onSubmit(values);
                setSubmitting(false);
            }}
        >
            {({ isSubmitting }) => (
                <Form>
                    <Field type="text" name="title" placeholder="Title" />
                    <Field component="textarea" name="description" placeholder="Description" />
                    <button type="submit" disabled={isSubmitting}>Save</button>
                </Form>
            )}
        </Formik>
    );
}

export default EditTask;