import { supabase } from "./supabase.js";

// Fetch all trips (with their activities) for the current user
export async function fetchTrips() {
  const { data, error } = await supabase
    .from("trips")
    .select("*, activities(*)")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}

// Insert a new trip, return the created row
export async function insertTrip(trip) {
  const { data: userData } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("trips")
    .insert({
      user_id: userData.user.id,
      name: trip.name,
      destination: trip.destination,
      country_code: trip.countryCode,
      start_date: trip.start,
      end_date: trip.end,
      status: trip.status,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Delete a trip (activities cascade automatically)
export async function deleteTrip(tripId) {
  const { error } = await supabase.from("trips").delete().eq("id", tripId);
  if (error) throw error;
}

// Insert an activity for a trip, return the created row
export async function insertActivity(tripId, activity) {
  const { data, error } = await supabase
    .from("activities")
    .insert({
      trip_id: tripId,
      type: activity.type,
      name: activity.name,
      city: activity.city,
      rating: activity.rating,
      notes: activity.notes,
      coords: activity.coords,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Delete an activity
export async function deleteActivity(activityId) {
  const { error } = await supabase.from("activities").delete().eq("id", activityId);
  if (error) throw error;
}

// Update an activity
export async function updateActivity(activityId, updates) {
  const { error } = await supabase
    .from("activities")
    .update({
      name: updates.name,
      type: updates.type,
      rating: updates.rating,
      notes: updates.notes,
    })
    .eq("id", activityId);

  if (error) throw error;
}
