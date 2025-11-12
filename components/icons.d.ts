import { FC, SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
  className?: string;
};

declare module '@/components/icons' {
  export const Icons: {
    google: FC<IconProps>;
    twitter: FC<IconProps>;
    discord: FC<IconProps>;
    mail: FC<IconProps>;
    spinner: FC<IconProps>;
    user: FC<IconProps>;
    logOut: FC<IconProps>;
  };
}
