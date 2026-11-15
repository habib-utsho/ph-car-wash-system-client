
"use client";

import { useState, useTransition, type SyntheticEvent } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { createService } from "@/lib/action/services";
import type { TServiceFormState } from "@/types";
import { useSession } from "@/lib/auth-client";

type ServiceFormProps = {
  onSuccess: () => void;
};

// The Add Service form. On submit it sends the form to the createService server action.
// The action checks every field, so this component only shows what comes back.
const ServiceForm = ({ onSuccess }: ServiceFormProps) => {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<TServiceFormState | null>(null);

  const { data: session } = useSession();
  const user = session?.user;
  const branch = user?.branch || "Dhaka";

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data = Object.fromEntries(formData.entries());

    console.log(data, "data");

    startTransition(async () => {
      try {
        const response = await createService(formData);
        setResult(response);

        if (response.success) {
          toast.add({ title: "Service added", description: response.message });
          onSuccess();
        }
      } catch {
        setResult({
          success: false,
          message: "Could not save the service. Please try again.",
        });
      }
    });
  };

  const errors = result?.errors ?? {};

  console.log(user, "user");

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        {result && !result.success && (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertDescription>{result.message}</AlertDescription>
          </Alert>
        )}

        <Field data-invalid={!!errors.name || undefined}>
          <FieldLabel htmlFor="name">Service name</FieldLabel>
          <Input
            id="name"
            name="name"
            placeholder="Premium Foam Wash"
            required
            disabled={isPending}
            aria-invalid={!!errors.name || undefined}
          />
          <FieldError>{errors.name}</FieldError>
        </Field>

        <Field data-invalid={!!errors.branch || undefined}>
          <FieldLabel htmlFor="branch">Branch name</FieldLabel>
          <Input
            id="branch"
            name="branch"
            placeholder="Branch"
            required
            value={branch || "Dhaka"}
            readOnly
            aria-invalid={!!errors.branch || undefined}
          />
          <FieldError>{errors.branch}</FieldError>
        </Field>

        <Field data-invalid={!!errors.image || undefined}>
          <FieldLabel htmlFor="image">Image URL</FieldLabel>
          <Input
            id="image"
            name="image"
            type="url"
            placeholder="https://example.com/wash.jpg"
            required
            disabled={isPending}
            aria-invalid={!!errors.image || undefined}
          />
          <FieldError>{errors.image}</FieldError>
        </Field>

        <Field data-invalid={!!errors.description || undefined}>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <Textarea
            id="description"
            name="description"
            rows={3}
            placeholder="What does this service include?"
            required
            disabled={isPending}
            aria-invalid={!!errors.description || undefined}
          />
          <FieldError>{errors.description}</FieldError>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field data-invalid={!!errors.price || undefined}>
            <FieldLabel htmlFor="price">Price (৳)</FieldLabel>
            <Input
              id="price"
              name="price"
              type="number"
              min={0}
              step="any"
              placeholder="500"
              required
              disabled={isPending}
              aria-invalid={!!errors.price || undefined}
            />
            <FieldError>{errors.price}</FieldError>
          </Field>

          <Field data-invalid={!!errors.duration || undefined}>
            <FieldLabel htmlFor="duration">Duration (minutes)</FieldLabel>
            <Input
              id="duration"
              name="duration"
              type="number"
              min={1}
              step={1}
              placeholder="45"
              required
              disabled={isPending}
              aria-invalid={!!errors.duration || undefined}
            />
            <FieldError>{errors.duration}</FieldError>
          </Field>
        </div>

        <Field data-invalid={!!errors.keyFeatures || undefined}>
          <FieldLabel htmlFor="keyFeatures">Key features</FieldLabel>
          <Textarea
            id="keyFeatures"
            name="keyFeatures"
            rows={3}
            placeholder={"Exterior foam wash\nInterior vacuum\nTire polish"}
            required
            disabled={isPending}
            aria-invalid={!!errors.keyFeatures || undefined}
          />
          <FieldError>{errors.keyFeatures}</FieldError>
        </Field>

        <Field data-invalid={!!errors.slot || undefined}>
          <FieldLabel htmlFor="slot">Slot (optional)</FieldLabel>
          <Input
            id="slot"
            name="slot"
            placeholder="Morning, 9 AM – 11 AM"
            disabled={isPending}
            aria-invalid={!!errors.slot || undefined}
          />
          <FieldError>{errors.slot}</FieldError>
        </Field>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isPending}
            className="bg-[#15295e] text-white hover:bg-[#1e3a80]"
          >
            {isPending ? (
              <>
                <Spinner />
                Saving…
              </>
            ) : (
              "Add service"
            )}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
};

export default ServiceForm;
