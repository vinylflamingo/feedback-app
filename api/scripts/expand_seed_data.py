import json
import copy

def find_highest_ids(data):
    highest_ids = {
        'user': max(user['id'] for user in data['users']),
        'suggestion': max(suggestion['id'] for suggestion in data['suggestions']),
        'comment': max(comment['id'] for comment in data['comments']),
        'upvote': max(upvote['id'] for upvote in data['upvotes'])
    }
    return highest_ids

def increment_ids(data, highest_ids):
    new_data = copy.deepcopy(data)

    user_increment = highest_ids['user']
    suggestion_increment = highest_ids['suggestion']
    comment_increment = highest_ids['comment']
    upvote_increment = highest_ids['upvote']

    for user in new_data['users']:
        user['id'] += user_increment

    for suggestion in new_data['suggestions']:
        suggestion['id'] += suggestion_increment
        suggestion['owner_id'] += user_increment

    for comment in new_data['comments']:
        comment['id'] += comment_increment
        comment['suggestion_id'] += suggestion_increment
        comment['user_id'] += user_increment
        if comment['parent_comment_id'] is not None:
            comment['parent_comment_id'] += comment_increment

    for upvote in new_data['upvotes']:
        upvote['id'] += upvote_increment
        upvote['suggestion_id'] += suggestion_increment
        upvote['user_id'] += user_increment

    return new_data

def append_data(original_data, new_data):
    appended_data = copy.deepcopy(original_data)
    appended_data['users'].extend(new_data['users'])
    appended_data['suggestions'].extend(new_data['suggestions'])
    appended_data['comments'].extend(new_data['comments'])
    appended_data['upvotes'].extend(new_data['upvotes'])
    return appended_data

def main():
    input_file = '../seed_data.json'
    output_file = 'appended_seed_data.json'

    try:
        with open(input_file, 'r') as file:
            original_data = json.load(file)
    except FileNotFoundError:
        print(f"Error: {input_file} not found.")
        return
    except json.JSONDecodeError:
        print(f"Error: {input_file} contains invalid JSON.")
        return

    highest_ids = find_highest_ids(original_data)
    incremented_data = increment_ids(original_data, highest_ids)
    appended_data = append_data(original_data, incremented_data)

    try:
        with open(output_file, 'w') as file:
            json.dump(appended_data, file, indent=2)
    except IOError as e:
        print(f"Error writing to {output_file}: {e}")

    print(f"Data incremented, appended, and saved to {output_file}")

if __name__ == "__main__":
    main()
