import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const pollOptions = [
  "Hobbyist -> startups -> enterprise",
  "non-technical founder -> PM -> founder",
  "super technical founders+agencies -> semi-technical PM -> non-technicals",
  "landing pages -> ui's -> full stack apps"
];

// Simulated API calls
const fetchVotes = async () => {
  // In a real app, this would be an API call
  return JSON.parse(localStorage.getItem('votes') || '{}');
};

const saveVote = async (newVote) => {
  // In a real app, this would be an API call
  const currentVotes = JSON.parse(localStorage.getItem('votes') || '{}');
  const updatedVotes = { ...currentVotes, ...newVote };
  localStorage.setItem('votes', JSON.stringify(updatedVotes));
  return updatedVotes;
};

const Index = () => {
  const [name, setName] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const queryClient = useQueryClient();

  const { data: votes = {} } = useQuery({
    queryKey: ['votes'],
    queryFn: fetchVotes,
  });

  const mutation = useMutation({
    mutationFn: saveVote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['votes'] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && selectedOptions.length > 0) {
      mutation.mutate({ [name]: selectedOptions });
      setName('');
      setSelectedOptions([]);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            What is the right sequencing to build and who to build for?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
            />
            <div className="space-y-2">
              {pollOptions.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`option-${index}`}
                    checked={selectedOptions.includes(option)}
                    onCheckedChange={(checked) => {
                      setSelectedOptions(
                        checked
                          ? [...selectedOptions, option]
                          : selectedOptions.filter((item) => item !== option)
                      );
                    }}
                  />
                  <label
                    htmlFor={`option-${index}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
            <Button type="submit" className="w-full">
              Submit Vote
            </Button>
          </form>
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">Current Votes:</h3>
            {Object.entries(votes).map(([voter, options]) => (
              <div key={voter} className="mb-2">
                <span className="font-medium">{voter}:</span>{' '}
                {options.join(', ')}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
