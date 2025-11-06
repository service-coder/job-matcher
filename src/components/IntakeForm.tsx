"use client";

import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Textarea } from "./ui/Textarea";
import { Checkbox } from "./ui/Checkbox";

type IntakeFormProps = {
  onSubmit: (data: {
    name: string;
    phone: string;
    email: string;
    address: string;
    company?: string;
    description: string;
    difficultAccess: boolean;
  }) => void;
  onClear?: () => void;
};

export function IntakeForm({ onSubmit, onClear }: IntakeFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      address: formData.get("address") as string,
      company: formData.get("company") as string | undefined,
      description: formData.get("description") as string,
      difficultAccess: formData.get("difficultAccess") === "on",
    };
    onSubmit(data);
  };

  const handleClear = () => {
    const form = document.getElementById("intake-form") as HTMLFormElement;
    form?.reset();
    onClear?.();
  };

  return (
    <form
      id="intake-form"
      onSubmit={handleSubmit}
      className="space-y-4"
      noValidate
    >
      <Input
        id="name"
        name="name"
        type="text"
        label="Name"
        required
        placeholder="Enter your name"
      />

      <Input
        id="phone"
        name="phone"
        type="tel"
        label="Phone"
        required
        placeholder="Enter your phone number"
      />

      <Input
        id="email"
        name="email"
        type="email"
        label="Email"
        required
        placeholder="Enter your email"
      />

      <Input
        id="address"
        name="address"
        type="text"
        label="Address"
        required
        placeholder="Enter your address"
      />

      <Input
        id="company"
        name="company"
        type="text"
        label="Company (optional)"
        placeholder="Enter company name"
      />

      <Textarea
        id="description"
        name="description"
        label="Description"
        required
        placeholder="Describe your requirements (1-5 sentences)"
      />

      <Checkbox
        id="difficultAccess"
        name="difficultAccess"
        label="Difficult access"
      />

      <div className="flex gap-2">
        <Button type="submit" variant="primary">
          Run Matching
        </Button>
        <Button type="button" variant="secondary" onClick={handleClear}>
          Clear
        </Button>
      </div>
    </form>
  );
}
