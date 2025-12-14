import React from 'react';

interface FormattedNumberProps {
  value: number | undefined;
}

/**
 * 用逗号分隔的数字
 */
const FormattedNumber: React.FC<FormattedNumberProps> = ({ value }) => {
  if (value === undefined || value === null) {
    return <span>--</span>;
  }
  return <>{value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</>;
};

export default FormattedNumber;
