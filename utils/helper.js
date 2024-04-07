export function capitizileLetter(name) {
    return {
      $reduce: {
        input: {
          $split: [name, " "],
        },
        initialValue: "",
        in: {
          $concat: [
            "$$value",
            { $cond: [{ $eq: ["$$value", ""] }, "", " "] },
            {
              $toUpper: { $substr: ["$$this", 0, 1] },
            },
            {
              $substr: [
                "$$this",
                1,
                { $strLenCP: "$$this" },
              ],
            },
          ],
        },
      },
    }
  }