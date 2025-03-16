import React from 'react';

import { Button } from "S/components/ui/button"
import { Calendar } from "@/components/ui/calendar"


function MyButton({ title }: { title: string }) {
  return (
    <button>{title}</button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton title="I'm a button" />
      <Button>Another</Button>
      <Calendar />
    </div>
  );
}
