import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

const ButtonSpinner = (props: any) => {
  const { onClick, loading, buttonName } = props;
  return (
    <Button
    fullWidth
    variant="contained"
    sx={{ mt: 3, mb: 2 }}
    onClick={onClick}
    disabled={loading}
    >
    {loading && <CircularProgress size={24} />}
    {!loading && buttonName}

    </Button>
  );
}

export default ButtonSpinner;
