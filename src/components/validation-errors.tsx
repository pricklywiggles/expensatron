type ValidationErrorsProps = {
  visited?: boolean;
  errors?: string[];
};
const ValidationErrors = ({
  errors,
  visited
}: ValidationErrorsProps): JSX.Element => {
  if (errors && visited) {
    return (
      <p className="mt-2 text-sm text-red-300" id="email-error">
        {errors[0]}
      </p>
    );
  } else {
    return null;
  }
};

export {ValidationErrors};
