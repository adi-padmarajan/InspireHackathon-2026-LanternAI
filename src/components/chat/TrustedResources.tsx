/**
 * TrustedResources - UVic wellness resources sidebar
 * Calm cards with essential student support links
 */

import { motion } from "framer-motion";
import { ExternalLink, Phone, MapPin, Clock, Heart, Users, Brain, Leaf, Sparkles } from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import { cn } from "@/lib/utils";

interface Resource {
  title: string;
  description: string;
  icon: React.ElementType;
  url?: string;
  phone?: string;
  hours?: string;
  location?: string;
}

interface SuggestedResource {
  id?: string;
  name: string;
  description: string;
  categories: string[];
  url?: string;
  location?: string | null;
}

interface TrustedResourcesProps {
  suggestedResources?: SuggestedResource[];
}

const uvicResources: Resource[] = [
  {
    title: "UVic Counselling Services",
    description: "Free, confidential mental health support",
    icon: Brain,
    url: "https://www.uvic.ca/student-wellness/wellness-resources/counselling/index.php",
    phone: "250-721-8341",
    location: "Health & Wellness Building",
  },
  {
    title: "Here2Talk",
    description: "24/7 counselling for BC students",
    icon: Phone,
    url: "https://here2talk.ca",
    phone: "1-877-857-3397",
    hours: "24/7",
  },
  {
    title: "Student Wellness Centre",
    description: "Holistic health and wellness programs",
    icon: Heart,
    url: "https://www.uvic.ca/student-wellness/",
    location: "Health & Wellness Building",
  },
  {
    title: "Peer Support Network",
    description: "Connect with trained student peers",
    icon: Users,
    url: "https://www.uvic.ca/student-wellness/wellness-resources/peer-support/",
  },
];

const cardVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut" as const,
    },
  }),
};

const normalizeUrl = (url?: string) => {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  if (url.startsWith("/")) return `https://www.uvic.ca${url}`;
  return `https://www.uvic.ca/${url}`;
};

export const TrustedResources = ({ suggestedResources = [] }: TrustedResourcesProps) => {
  const cleanedSuggested = suggestedResources.filter((resource) => resource?.name && resource?.description);
  const { logEvent } = useEvents();

  return (
    <aside className="space-y-4">
      {cleanedSuggested.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground tracking-wide uppercase">
              Suggested For You
            </h2>
          </div>

          <div className="space-y-3">
            {cleanedSuggested.map((resource, index) => {
              const href = normalizeUrl(resource.url);
              return (
                <motion.a
                  key={resource.id ?? resource.name}
                  href={href}
                  target={href ? "_blank" : undefined}
                  rel={href ? "noopener noreferrer" : undefined}
                  onClick={() =>
                    logEvent("resource_clicked", {
                      resource_id: resource.id ?? resource.name,
                      resource_type: "suggested",
                    })
                  }
                  className={cn(
                    "block p-4 rounded-2xl",
                    "bg-card/70 backdrop-blur-sm border border-border/40",
                    "hover:bg-card/90 hover:border-border/70",
                    "transition-all duration-300 group"
                  )}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-primary/15 text-primary shrink-0">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-medium text-foreground truncate">
                          {resource.name}
                        </h3>
                        {href && (
                          <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {resource.description}
                      </p>
                      {resource.location && (
                        <div className="flex items-center gap-1 mt-2 text-[10px] text-muted-foreground/70 font-mono">
                          <MapPin className="h-2.5 w-2.5" />
                          <span>{resource.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.a>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 mb-6 pt-2">
        <Leaf className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground tracking-wide uppercase">
          Trusted UVic Resources
        </h2>
      </div>

      <div className="space-y-3">
        {uvicResources.map((resource, index) => (
          <motion.a
            key={resource.title}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              logEvent("resource_clicked", {
                resource_id: resource.title,
                resource_type: "trusted",
              })
            }
            className={cn(
              "block p-4 rounded-2xl",
              "bg-card/60 backdrop-blur-sm border border-border/40",
              "hover:bg-card/80 hover:border-border/60",
              "transition-all duration-300 group"
            )}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={index}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-accent/50 text-primary shrink-0">
                <resource.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-medium text-foreground truncate">
                    {resource.title}
                  </h3>
                  <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {resource.description}
                </p>
                {(resource.phone || resource.hours || resource.location) && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {resource.phone && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground/70 font-mono">
                        <Phone className="h-2.5 w-2.5" />
                        {resource.phone}
                      </span>
                    )}
                    {resource.hours && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground/70 font-mono">
                        <Clock className="h-2.5 w-2.5" />
                        {resource.hours}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.a>
        ))}
      </div>

      {/* Crisis line callout */}
      <motion.div
        className="mt-6 p-4 rounded-2xl bg-destructive/10 border border-destructive/20"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-xs text-foreground/80 font-medium mb-1">
          In crisis? Call BC Crisis Line
        </p>
        <a
          href="tel:1-800-784-2433"
          className="text-sm font-mono font-semibold text-destructive hover:underline"
        >
          1-800-784-2433
        </a>
      </motion.div>
    </aside>
  );
};
