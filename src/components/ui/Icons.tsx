import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const UpvoteIcon: React.FC<IconProps> = ({ size = '1em', style, ...props }) => {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="far"
      data-icon="up"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 384 512"
      width={size}
      height={size}
      fill="currentColor"
      style={{ ...style }}
      {...props}
    >
      <path
        fill="currentColor"
        d="M192 82.4L334.7 232.3c.8 .8 1.3 2 1.3 3.2c0 2.5-2 4.6-4.6 4.6H248c-13.3 0-24 10.7-24 24V432H160V264c0-13.3-10.7-24-24-24H52.6c-2.5 0-4.6-2-4.6-4.6c0-1.2 .5-2.3 1.3-3.2L192 82.4zm192 153c0-13.5-5.2-26.5-14.5-36.3L222.9 45.2C214.8 36.8 203.7 32 192 32s-22.8 4.8-30.9 13.2L14.5 199.2C5.2 208.9 0 221.9 0 235.4c0 29 23.5 52.6 52.6 52.6H112V432c0 26.5 21.5 48 48 48h64c26.5 0 48-21.5 48-48V288h59.4c29 0 52.6-23.5 52.6-52.6z"
      ></path>
    </svg>
  );
};

export const DownvoteIcon: React.FC<IconProps> = ({ size = '1em', style, ...props }) => {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="far"
      data-icon="down"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 384 512"
      width={size}
      height={size}
      fill="currentColor"
      style={{ ...style }}
      {...props}
    >
      <path
        fill="currentColor"
        d="M192 429.6L49.3 279.7c-.8-.8-1.3-2-1.3-3.2c0-2.5 2-4.6 4.6-4.6l83.4 0c13.3 0 24-10.7 24-24l0-168 64 0 0 168c0 13.3 10.7 24 24 24l83.4 0c2.5 0 4.6 2 4.6 4.6c0 1.2-.5 2.3-1.3 3.2L192 429.6zM0 276.6c0 13.5 5.2 26.5 14.5 36.3L161.1 466.8c8.1 8.5 19.2 13.2 30.9 13.2s22.8-4.8 30.9-13.2L369.5 312.8c9.3-9.8 14.5-22.8 14.5-36.3c0-29-23.5-52.6-52.6-52.6L272 224l0-144c0-26.5-21.5-48-48-48l-64 0c-26.5 0-48 21.5-48 48l0 144-59.4 0C23.5 224 0 247.5 0 276.6z"
      ></path>
    </svg>
  );
};

export const CommentIcon: React.FC<IconProps> = ({ size = '1em', style, ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      style={{ ...style }}
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M11.997 21.5a9.5 9.5 0 01-8.49-5.251A9.38 9.38 0 012.5 11.997V11.5c.267-4.88 4.12-8.733 8.945-8.999L12 2.5a9.378 9.378 0 014.25 1.007A9.498 9.498 0 0121.5 12a9.378 9.378 0 01-.856 3.937l.838 4.376a1 1 0 01-1.17 1.17l-4.376-.838a9.381 9.381 0 01-3.939.856zm3.99-2.882l3.254.623-.623-3.253a1 1 0 01.09-.64 7.381 7.381 0 00.792-3.346 7.5 7.5 0 00-4.147-6.708 7.385 7.385 0 00-3.35-.794H11.5c-3.752.208-6.792 3.248-7.002 7.055L4.5 12a7.387 7.387 0 00.794 3.353A7.5 7.5 0 0012 19.5a7.384 7.384 0 003.349-.793 1 1 0 01.639-.09z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
};

export const ReplyIcon: React.FC<IconProps> = ({ size = '1em', style, ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="currentColor"
      style={{ ...style }}
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M5.83 2.106c.628-.634 1.71-.189 1.71.704v2.065c4.821.94 6.97 4.547 7.73 8.085l-.651.14.652-.134c.157.757-.83 1.192-1.284.565l-.007-.009c-1.528-2.055-3.576-3.332-6.44-3.502v2.352c0 .893-1.082 1.338-1.71.704L1.091 8.295a1 1 0 010-1.408l4.737-4.78zm7.303 8.617C12.08 8.495 10.204 6.68 7.046 6.14c-.47-.08-.84-.486-.84-.99V3.62L2.271 7.591l3.934 3.971V9.667a.993.993 0 011.018-.995c2.397.065 4.339.803 5.909 2.051z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
};
