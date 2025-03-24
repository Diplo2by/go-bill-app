interface ApiResponse {
    data: {
        [foodItem: string]: number;  // Food item name -> calories
    };
    success: boolean;
}
export const formattedCalorieCount = (apiResponse: ApiResponse) => {

    try {
        const foodItems = Object.entries(apiResponse.data).map(([name, calories]) => ({
            name,
            calories
        }));

        const totalCalories = foodItems.reduce((sum, item) => sum + item.calories, 0);
        const currentDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Format the text for clipboard
        let clipboardText = `Meal Analysis - ${currentDate}\n`;
        clipboardText += `Total Calories: ${totalCalories}\n\n`;
        clipboardText += "Items:\n";

        foodItems.forEach(item => {
            clipboardText += `- ${item.name}: ${item.calories} calories\n`;
        });

        return clipboardText
    } catch (error) {
        console.error('Error copying to clipboard:', error);
    }
}