import Foundation
import UIKit

@objc(Notification)
class Notification : NSObject {
	@objc func notify(inMillis: NSNumber, repeatEvery: NSNumber, body: String) -> Void {
		let application = UIApplication.sharedApplication()
		let oneHour = Double(60 * 60)
		var nextTime = inMillis.doubleValue / 1000
		// this will only be correct when repeatEvery is a whole number factor of one hour
		while nextTime < oneHour {
			let notification = UILocalNotification()
			notification.fireDate = NSDate(timeIntervalSinceNow: nextTime)
			notification.alertBody = body
			notification.soundName = "glass.wav"
			notification.repeatInterval = NSCalendarUnit.Hour
			application.scheduleLocalNotification(notification)
			nextTime += repeatEvery.doubleValue / 1000
		}
	}
	@objc func clear() -> Void {
		let application = UIApplication.sharedApplication()
		application.cancelAllLocalNotifications()
	}
}
