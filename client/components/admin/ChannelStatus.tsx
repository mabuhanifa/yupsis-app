"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useChannels } from "@/hooks/useAdmin";
import { CheckCircle2 } from "lucide-react";

export function ChannelStatus() {
  const { data: channels, isLoading } = useChannels();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected Channels</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading channels...</p>
        ) : (
          <div className="space-y-4">
            {channels?.map((channel) => (
              <div key={channel.id} className="flex items-center">
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                <span>{channel.name}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
