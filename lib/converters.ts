import { DocumentData, FirestoreDataConverter, SnapshotOptions, QueryDocumentSnapshot } from "firebase/firestore";
import { ClientFields } from "@/app/types/client";

export const clientConverter: FirestoreDataConverter<ClientFields> = {

  toFirestore(client: ClientFields): DocumentData {
    const { id, ...data } = client;
    return data;
  },

  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): ClientFields {
    const data = snapshot.data(options);

    return {
      id: snapshot.id,
      ...data
    } as ClientFields
  },
}