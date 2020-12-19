import React from 'react';

interface ICardProps {
  heading: React.ReactElement;
}

const Card: React.FunctionComponent<ICardProps> = ({ heading, children }) => {
  return (
    <div className="w-96 bg-white rounded-lg shadow-md">
      <div className="w-96 border-t-8 border-green-600 rounded-lg flex flex-col p-2">
        <div className="w-full border-b-2 border-grey-100">{heading}</div>
        <div className="w-full pt-6 pr-4">{children}</div>
      </div>
    </div>
  );
};

export default Card;
