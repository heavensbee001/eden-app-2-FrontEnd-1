import React from "react";

interface OgImageTemplateProps {
  title: string;
  company: string;
}

const OgImageTemplate: React.FC<OgImageTemplateProps> = ({
  title,
  company,
}) => {
  return (
    <div className="flex h-[630px] w-[1200px] items-center justify-center bg-blue-500">
      <div className="text-center">
        <h1 className="text-6xl text-white">{title}</h1>
        <p className="text-3xl text-gray-300">{company}</p>
      </div>
    </div>
  );
};

export default OgImageTemplate;
