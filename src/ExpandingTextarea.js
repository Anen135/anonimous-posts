import React, { useRef } from 'react';

const ExpandingTextarea = ({ name, placeholder, value }) => {
  const textareaRef = useRef(null);

  const handleInput = () => {
    const textarea = textareaRef.current;
    textarea.style.height = 'auto'; // сбрасываем высоту
    textarea.style.height = `${textarea.scrollHeight+10}px`; // устанавливаем новую высоту
  };

  return (
    <textarea
      ref={textareaRef}
      onInput={handleInput}
      name={name}
      placeholder={placeholder}
      value={value}
      className="resize-none w-full p-2 border"
    />
  );
};

export default ExpandingTextarea;
