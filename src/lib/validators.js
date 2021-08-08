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

// export const isValidBigNumber = Validation((key, x) => {
//   let y = BigNumber(x);
//   return BigNumber.isBigNumber(y) && !y.isNaN()
//     ? Success()
//     : Fail({[key]: [`Enter a valid number`]});
// });
