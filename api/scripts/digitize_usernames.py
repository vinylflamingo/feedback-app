import json
import os
import random

def add_random_digits_to_usernames(data):
    for user in data['users']:
        random_digits = random.randint(10, 9999)
        user['username'] = f"{user['username']}{random_digits}"
    return data

def main():
    input_file = '../seed_data.json'
    output_file = 'seed_data_with_random_usernames.json'

    try:
        with open(input_file, 'r') as file:
            data = json.load(file)
    except FileNotFoundError:
        print(f"Error: {input_file} not found.")
        return
    except json.JSONDecodeError:
        print(f"Error: {input_file} contains invalid JSON.")
        return

    modified_data = add_random_digits_to_usernames(data)

    try:
        with open(output_file, 'w') as file:
            json.dump(modified_data, file, indent=2)
    except IOError as e:
        print(f"Error writing to {output_file}: {e}")

    print(f"Usernames updated and saved to {output_file}")

if __name__ == "__main__":
    main()
