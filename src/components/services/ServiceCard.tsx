import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TService } from "@/types";

type ServiceCardProps = {
  service: TService;
};

// One service shown as a card on the public services page.
const ServiceCard = ({ service }: ServiceCardProps) => {
  return (
    <Card>
      {/* A box with a fixed height, so every card looks the same. */}
      <div className="relative h-48 w-full bg-muted">
        <Image
          src={service.image}
          alt={service.name}
          fill
          unoptimized
          className="object-cover"
        />
      </div>

      <CardHeader>
        <CardTitle>{service.name}</CardTitle>
        <div>
          <Badge variant="secondary">{service.branch}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {service.description}
        </p>
        <p className="text-sm font-medium">
          ৳ {service.price} · {service.duration} min
        </p>
        <Link
          href={`/services/${service._id}`}
          className="inline-flex h-9 w-full items-center justify-center rounded-lg bg-[#15295e] text-sm font-medium text-white hover:bg-[#1e3a80]"
        >
          View details
        </Link>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
