import json
import re
import copy

def strip_numbers_from_usernames(data):
    new_data = copy.deepcopy(data)
    
    for user in new_data['users']:
        user['username'] = re.sub(r'\d+', '', user['username'])
    
    return new_data

def main():
    input_file = '../seed_data.json'
    output_file = 'stripped_usernames_seed_data.json'

    try:
        with open(input_file, 'r') as file:
            data = json.load(file)
    except FileNotFoundError:
        print(f"Error: {input_file} not found.")
        return
    except json.JSONDecodeError:
        print(f"Error: {input_file} contains invalid JSON.")
        return

    stripped_data = strip_numbers_from_usernames(data)

    try:
        with open(output_file, 'w') as file:
            json.dump(stripped_data, file, indent=2)
    except IOError as e:
        print(f"Error writing to {output_file}: {e}")

    print(f"Usernames stripped and saved to {output_file}")

if __name__ == "__main__":
    main()
