import BigNumber from 'bignumber.js';
import dayjs from 'dayjs';
import {Validation, Success, Fail} from 'tiny-validation';

export const isValidBigNumber = Validation((key, x) => {
  let y = BigNumber(x);
  return BigNumber.isBigNumber(y) && !y.isNaN()
    ? Success()
    : Fail({[key]: [`Enter a valid number`]});
});

export const isValidDate = Validation((key, x) =>
  dayjs(x).isValid() ? Success() : Fail({[key]: [`Must be a valid date`]})
);

export const isNotFutureDate = Validation((key, x) =>
  dayjs() - dayjs(x) < 0 ? Fail({[key]: [`Can't be in the future`]}) : Success()
);

// Dollar amounts can't be more precise than cents
export const isValidDollarAmount = Validation((key, x) => {
  let v = new BigNumber(x);
  return v.dp() > 2 ? Fail({[key]: [`Max of 2 decimal places`]}) : Success();
});

// export const isValidBigNumber = Validation((key, x) => {
//   let y = BigNumber(x);
//   return BigNumber.isBigNumber(y) && !y.isNaN()
//     ? Success()
//     : Fail({[key]: [`Enter a valid number`]});
// });
