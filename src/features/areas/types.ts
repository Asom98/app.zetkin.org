export type PointData = [number, number];

export type ZetkinArea = {
  description: string | null;
  id: string;
  organization: {
    id: number;
  };
  points: PointData[];
  title: string | null;
};

export type ZetkinAreaPostBody = Partial<Omit<ZetkinArea, 'id'>>;