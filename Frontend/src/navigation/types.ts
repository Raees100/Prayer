import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Login: { message?: string };
  SignUp: undefined;
  ForgotPassword: undefined;
  VerifyOTP: { email: string };
  ResetPassword: { email: string; otp: string };
  AllNamaz: undefined;
  Calendar: { currentDate: Date };
  Fajar: { isCompleted: boolean; status: string; currentDate: Date };
  Zuhr: { isCompleted: boolean; status: string; currentDate: Date };
  Asar: { isCompleted: boolean; status: string; currentDate: Date };
  Magrib: { isCompleted: boolean; status: string; currentDate: Date };
  Esha: { isCompleted: boolean; status: string; currentDate: Date };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = 
  NativeStackScreenProps<RootStackParamList, T>;

export type AllNamazScreenProps = RootStackScreenProps<'AllNamaz'>;
export type CalendarScreenProps = RootStackScreenProps<'Calendar'>;
export type FajarScreenProps = RootStackScreenProps<'Fajar'>;
export type ZuhrScreenProps = RootStackScreenProps<'Zuhr'>;
export type AsarScreenProps = RootStackScreenProps<'Asar'>;
export type MagribScreenProps = RootStackScreenProps<'Magrib'>;
export type EshaScreenProps = RootStackScreenProps<'Esha'>;