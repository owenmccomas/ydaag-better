"use client"

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface WeatherPeriod {
  temperature: number;
  shortForecast: string;
  startTime: string;
  endTime: string;
}

const WeatherWidget: React.FC = () => {
  const [currentPeriod, setCurrentPeriod] = useState<WeatherPeriod | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const localStorage = window.localStorage;

      // Retrieve city and state from local storage
      const storedCity = localStorage.getItem("city");
      const storedState = localStorage.getItem("state");
      const storedFormSubmitted = localStorage.getItem("formSubmitted");

      if (storedCity) {
        setCity(storedCity);
      }

      if (storedState) {
        setState(storedState);
      }

      if (storedFormSubmitted === "true") {
        setFormSubmitted(true);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const localStorage = window.localStorage;

      // Save the city and state to local storage whenever they change
      localStorage.setItem("city", city);
      localStorage.setItem("state", state);
      // Save the formSubmitted flag to local storage
      localStorage.setItem("formSubmitted", String(formSubmitted));
    }
  }, [city, state, formSubmitted]);

  // Function to convert city and state to coordinates
  const geocodeCityState = async (
    city: string,
    state: string
  ): Promise<{ lat: number; lng: number }> => {
    const address = `${city}, ${state}`;
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`;

    try {
      const response = await axios.get(url);

      if (response.data.results.length > 0) {
        const { lat, lng } = response.data.results[0].geometry.location;
        return { lat, lng };
      } else {
        throw new Error("No results found");
      }
    } catch (error) {
      throw new Error("Geocoding request failed");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { lat, lng } = await geocodeCityState(city, state);

      const pointsResponse = await axios.get(
        `https://api.weather.gov/points/${lat},${lng}`
      );
      const forecastHourlyUrl = pointsResponse.data.properties.forecastHourly;
      const hourlyForecastResponse = await axios.get(forecastHourlyUrl);
      const periods = hourlyForecastResponse.data.properties.periods;
      const currentDateTime = new Date();

      for (const period of periods) {
        const startTime = new Date(period.startTime);
        const endTime = new Date(period.endTime);

        if (currentDateTime >= startTime && currentDateTime <= endTime) {
          setCurrentPeriod(period);
          setLoading(false);
          setFormSubmitted(true);
          break;
        }
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError("Error fetching weather data");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formSubmitted) {
      const submitEvent = new Event("submit");
      handleSubmit(submitEvent as unknown as React.FormEvent);
    }
  }, [formSubmitted]);

  return (
    <div className="flex justify-end">
      {formSubmitted ? (
        loading ? (
          <div className="text-white">Loading weather data...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : currentPeriod ? (
          <div className="space-y-2">
            <div className="text-lg text-white font-semibold">
              {currentPeriod.temperature}&deg;F
            </div>
            <div className="text-white">{currentPeriod.shortForecast}</div>
          </div>
        ) : (
          <div className="text-white">No weather data available</div>
        )
      ) : (
        <form onSubmit={handleSubmit} className="p-1">
          <Input
            type="text"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
          <Input
            type="text"
            placeholder="Enter state"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
          <Button
            type="submit"
            className="px-4 py-2 text-white rounded"
            variant={"outline"}
          >
            Get Weather
          </Button>
        </form>
      )}
    </div>
  );
};

export default WeatherWidget;
